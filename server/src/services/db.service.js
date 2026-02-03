const pkg = require('pg');

const { Pool } = pkg;

const optionsTable = (process.env.OPTIONS_TABLE || 'options_data_ht').replace(
  /[^a-zA-Z0-9_]/g,
  ''
);

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'options_platform',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('✅ Database pool connected');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
});

async function getAvailableSymbols() {
  const query = `
    SELECT DISTINCT underlying_symbol
    FROM ${optionsTable}
    ORDER BY underlying_symbol
  `;
  const { rows } = await pool.query(query);
  return rows.map((row) => row.underlying_symbol);
}

async function getAvailableDates(symbol) {
  const query = `
    SELECT 
      time_date,
      TO_CHAR(time_date, 'YYYY-MM-DD') as date_str,
      COUNT(*) as row_count
    FROM ${optionsTable}
    WHERE underlying_symbol = $1
      AND time_date IS NOT NULL
    GROUP BY time_date
    HAVING COUNT(*) > 1000
    ORDER BY time_date DESC
    LIMIT 200
  `;
  const { rows } = await pool.query(query, [symbol]);
  return rows.map((row) => row.date_str);
}

async function getExpiriesByDate(symbol, tradingDate) {
  const query = `
    SELECT DISTINCT 
      expiry_date,
      TO_CHAR(expiry_date, 'YYYY-MM-DD') as expiry_str
    FROM ${optionsTable}
    WHERE underlying_symbol = $1
      AND time_date = $2::date
      AND expiry_date >= $2::date
    ORDER BY expiry_date ASC
  `;
  const { rows } = await pool.query(query, [symbol, tradingDate]);
  return rows.map((row) => row.expiry_str);
}

async function getAvailableTimestamps(symbol, date, expiry) {
  const query = `
    SELECT DISTINCT time
    FROM ${optionsTable}
    WHERE underlying_symbol = $1
      AND time_date = $2::date
      AND expiry_date = $3::date
    ORDER BY time ASC
  `;
  const { rows } = await pool.query(query, [symbol, date, expiry]);
  return rows.map((row) => row.time.toISOString());
}

async function getSnapshot(symbol, expiry, timestamp) {
  const query = `
    SELECT
      time,
      expiry_date,
      strike_price,
      option_type,
      open_interest,
      oi_change,
      last_price,
      underlying_value
    FROM ${optionsTable}
    WHERE underlying_symbol = $1
      AND expiry_date = $2::date
      AND time = $3
    ORDER BY strike_price ASC, option_type ASC
  `;
  const { rows } = await pool.query(query, [symbol, expiry, timestamp]);
  return rows;
}

async function playbackStep(params) {
  const { symbol, expiry, timestamp, direction = 'forward' } = params || {};
  if (!symbol || !expiry || !timestamp) {
    return { timestamp: null, rows: [] };
  }

  const query = `
    SELECT time
    FROM ${optionsTable}
    WHERE underlying_symbol = $1
      AND expiry_date = $2::date
      AND time ${direction === 'backward' ? '<' : '>'} $3
    ORDER BY time ${direction === 'backward' ? 'DESC' : 'ASC'}
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [symbol, expiry, timestamp]);
  if (rows.length === 0) {
    return { timestamp: null, rows: [] };
  }

  const nextTime = rows[0].time;
  const snapshot = await getSnapshot(symbol, expiry, nextTime);
  return { timestamp: nextTime.toISOString(), rows: snapshot };
}

module.exports = {
  pool,
  getAvailableSymbols,
  getAvailableDates,
  getExpiriesByDate,
  getAvailableTimestamps,
  getSnapshot,
  playbackStep,
};
