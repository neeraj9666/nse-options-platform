
CREATE MATERIALIZED VIEW IF NOT EXISTS oi_snapshot_1m AS
SELECT
  time_bucket('1 minute', time) AS bucket,
  underlying_symbol,
  expiry_date,
  strike_price,
  option_type,
  last(open_interest, time) AS oi
FROM options_data
GROUP BY bucket, underlying_symbol, expiry_date, strike_price, option_type;
