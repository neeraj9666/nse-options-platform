const { Pool } = require('pg');

/**
 * PostgreSQL / TimescaleDB connection
 * NOTE: password confirmed as 1234
 */
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'options_platform',
  max: 10,
});

/**
 * Fetch ONE clean snapshot of option chain
 * Snapshot = (symbol, expiry, time)
 */
async function getOptionChainSnapshot({ symbol, expiry, atTime }) {
  const query = `
    SELECT
      time,
      strike_price,
      option_type,
      last_price,
      open_interest,
      oi_change,
      underlying_value
    FROM options_data
    WHERE underlying_symbol = $1
      AND expiry_date = $2
      AND time = $3
    ORDER BY strike_price ASC;
  `;

  const values = [symbol, expiry, atTime];

  const res = await pool.query(query, values);

  return res.rows;
}

module.exports = {
  getOptionChainSnapshot,
};
