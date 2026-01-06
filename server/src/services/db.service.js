const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'options_platform',
  max: 10,
});

/**
 * Resolve nearest valid timestamp >= atTime
 */
async function resolveNearestTime(client, symbol, expiry, atTime) {
  const q = `
    SELECT time
    FROM public.options_data_ht
    WHERE underlying_symbol = $1
      AND expiry_date = $2
      AND time >= $3
    ORDER BY time
    LIMIT 1;
  `;
  const r = await client.query(q, [symbol, expiry, atTime]);
  return r.rows[0]?.time || null;
}

/**
 * Next valid timestamp
 */
async function getNextTime(client, symbol, expiry, currentTime) {
  const q = `
    SELECT time
    FROM public.options_data_ht
    WHERE underlying_symbol = $1
      AND expiry_date = $2
      AND time > $3
    ORDER BY time
    LIMIT 1;
  `;
  const r = await client.query(q, [symbol, expiry, currentTime]);
  return r.rows[0]?.time || null;
}

/**
 * Previous valid timestamp
 */
async function getPrevTime(client, symbol, expiry, currentTime) {
  const q = `
    SELECT time
    FROM public.options_data_ht
    WHERE underlying_symbol = $1
      AND expiry_date = $2
      AND time < $3
    ORDER BY time DESC
    LIMIT 1;
  `;
  const r = await client.query(q, [symbol, expiry, currentTime]);
  return r.rows[0]?.time || null;
}


async function getAvailableSymbols() {
  const q = `
    SELECT DISTINCT underlying_symbol
    FROM public.options_data_ht
    ORDER BY underlying_symbol;
  `;
  const { rows } = await pool.query(q);
  return rows.map(r => r.underlying_symbol);
}

async function getAvailableExpiries(symbol) {
  const q = `
    SELECT DISTINCT expiry_date
    FROM public.options_data_ht
    WHERE underlying_symbol = $1
    ORDER BY expiry_date;
  `;
  const { rows } = await pool.query(q, [symbol]);
  return rows.map(r => r.expiry_date);
}

async function getAvailableDates(symbol, expiry) {
  const q = `
    SELECT DISTINCT DATE(time) AS trade_date
    FROM public.options_data_ht
    WHERE underlying_symbol = $1
      AND expiry_date = $2
    ORDER BY trade_date;
  `;
  const { rows } = await pool.query(q, [symbol, expiry]);
  return rows.map(r => r.trade_date);
}

/**
 * Snapshot query (1 timestamp, pivoted CE/PE)
 */
async function getSnapshotAtTime(client, symbol, expiry, time) {
  const q = `
    SELECT
      strike_price,

      MAX(CASE WHEN option_type = 'CE' THEN last_price END) AS ce_ltp,
      MAX(CASE WHEN option_type = 'CE' THEN open_interest END) AS ce_oi,
      MAX(CASE WHEN option_type = 'CE' THEN oi_change END) AS ce_oi_change,

      MAX(CASE WHEN option_type = 'PE' THEN last_price END) AS pe_ltp,
      MAX(CASE WHEN option_type = 'PE' THEN open_interest END) AS pe_oi,
      MAX(CASE WHEN option_type = 'PE' THEN oi_change END) AS pe_oi_change,

      MAX(underlying_value) AS underlying_value
    FROM public.options_data_ht
    WHERE underlying_symbol = $1
      AND expiry_date = $2
      AND time = $3
    GROUP BY strike_price
    ORDER BY strike_price;
  `;
  const { rows } = await client.query(q, [symbol, expiry, time]);
  return rows;
}

/**
 * Playback engine step
 */
async function playbackStep({ symbol, expiry, currentTime, direction }) {
  const client = await pool.connect();
  try {
    let nextTime;

    if (!currentTime) {
      nextTime = await resolveNearestTime(client, symbol, expiry, new Date());
    } else if (direction === 'PREV') {
      nextTime = await getPrevTime(client, symbol, expiry, currentTime);
    } else {
      nextTime = await getNextTime(client, symbol, expiry, currentTime);
    }

    if (!nextTime) {
      return { success: false, error: 'NO_MORE_DATA' };
    }

    const rows = await getSnapshotAtTime(client, symbol, expiry, nextTime);

    return {
      success: true,
      time: nextTime,
      rows,
    };
  } catch (err) {
    console.error('❌ Playback step error:', err);
    return { success: false, error: err.message };
  } finally {
    client.release();
  }
}

module.exports = {
  playbackStep,
  getAvailableSymbols,
  getAvailableExpiries,
  getAvailableDates,
};

