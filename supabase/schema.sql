-- ============================================================
-- RailRakshak AI — Supabase PostgreSQL Schema
-- Run this SQL in your Supabase SQL Editor to initialize tables.
-- ============================================================

-- -------- DETECTIONS --------
CREATE TABLE IF NOT EXISTS detections (
    id TEXT PRIMARY KEY DEFAULT 'DET-' || floor(extract(epoch FROM now()))::text,
    detection_code TEXT NOT NULL,
    defect_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    confidence REAL NOT NULL,
    track_section_id TEXT,
    track_section_name TEXT,
    location_km REAL NOT NULL,
    coordinates JSONB DEFAULT '{}',
    segment_code TEXT,
    camera_ref TEXT,
    line_speed_kmh REAL,
    ambient_temp_c REAL,
    estimated_depth_mm REAL,
    image_url TEXT,
    bounding_box JSONB,
    reasoning_factors JSONB DEFAULT '[]',
    recommended_action TEXT,
    status TEXT NOT NULL DEFAULT 'pending_verification',
    assigned_engineer TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------- ALERTS --------
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    alert_code TEXT NOT NULL,
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    track_section TEXT NOT NULL,
    location_km REAL NOT NULL,
    detection_source TEXT,
    ai_confidence REAL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'false_positive')),
    assigned_engineer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------- TRAINS (Live snapshot) --------
CREATE TABLE IF NOT EXISTS trains (
    id TEXT PRIMARY KEY,
    train_number TEXT NOT NULL,
    train_name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    speed_kmh REAL DEFAULT 0,
    direction TEXT,
    status TEXT NOT NULL DEFAULT 'RUNNING' CHECK (status IN ('RUNNING', 'DELAYED', 'WARNING', 'STOPPED')),
    current_station TEXT,
    next_station TEXT,
    delay_minutes INT DEFAULT 0,
    eta TEXT,
    last_updated_sec INT DEFAULT 0,
    route TEXT,
    next_stations JSONB DEFAULT '[]',
    approaching_alert JSONB,
    data_source TEXT DEFAULT 'SUPABASE',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------- WEATHER REPORTS --------
CREATE TABLE IF NOT EXISTS weather_reports (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    city TEXT NOT NULL,
    division TEXT NOT NULL,
    temperature_c REAL,
    feels_like_c REAL,
    humidity_pct INT,
    wind_speed_kmh REAL,
    wind_direction_deg INT,
    rainfall_mm_1h REAL DEFAULT 0,
    visibility_km REAL,
    pressure_hpa INT,
    condition TEXT,
    condition_icon TEXT,
    weather_risk_score INT DEFAULT 0,
    weather_risk_level TEXT DEFAULT 'LOW',
    drainage_risk TEXT DEFAULT 'LOW',
    buckling_risk TEXT DEFAULT 'LOW',
    catenary_risk TEXT DEFAULT 'LOW',
    visibility_risk TEXT DEFAULT 'NORMAL',
    track_impact_summary TEXT,
    data_source TEXT DEFAULT 'SUPABASE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------- WORK ORDERS --------
CREATE TABLE IF NOT EXISTS work_orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    risk_id TEXT NOT NULL,
    target_date TEXT NOT NULL,
    assigned_gang TEXT,
    remediation_protocol TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------- KPIs (Network Snapshot) --------
CREATE TABLE IF NOT EXISTS kpis (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    track_network_km REAL DEFAULT 4280.0,
    track_network_change_km REAL DEFAULT 12.0,
    track_health_pct REAL DEFAULT 94.8,
    track_health_status TEXT DEFAULT 'STABLE',
    active_alerts_count INT DEFAULT 0,
    critical_alerts_count INT DEFAULT 0,
    ai_detections_today INT DEFAULT 0,
    ai_detections_cap_pct INT DEFAULT 0,
    maintenance_due_count INT DEFAULT 0,
    open_inspections_count INT DEFAULT 0,
    live_trains_count INT DEFAULT 0,
    running_trains_count INT DEFAULT 0,
    delayed_trains_count INT DEFAULT 0,
    weather_condition TEXT DEFAULT 'Clear',
    weather_risk_score INT DEFAULT 0,
    snapshot_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS) — Allow public read for demo
-- ============================================================
ALTER TABLE detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon + authenticated)
CREATE POLICY "Allow public read on detections" ON detections FOR SELECT USING (true);
CREATE POLICY "Allow public read on alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read on trains" ON trains FOR SELECT USING (true);
CREATE POLICY "Allow public read on weather_reports" ON weather_reports FOR SELECT USING (true);
CREATE POLICY "Allow public read on work_orders" ON work_orders FOR SELECT USING (true);
CREATE POLICY "Allow public read on kpis" ON kpis FOR SELECT USING (true);

-- Service-role insert/update policies
CREATE POLICY "Allow service insert on detections" ON detections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update on detections" ON detections FOR UPDATE USING (true);
CREATE POLICY "Allow service insert on alerts" ON alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update on alerts" ON alerts FOR UPDATE USING (true);
CREATE POLICY "Allow service insert on trains" ON trains FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update on trains" ON trains FOR UPDATE USING (true);
CREATE POLICY "Allow service insert on weather_reports" ON weather_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service insert on work_orders" ON work_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update on work_orders" ON work_orders FOR UPDATE USING (true);
CREATE POLICY "Allow service insert on kpis" ON kpis FOR INSERT WITH CHECK (true);

-- ============================================================
-- Indexes for common queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_detections_severity ON detections (severity);
CREATE INDEX IF NOT EXISTS idx_detections_status ON detections (status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts (severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts (status);
CREATE INDEX IF NOT EXISTS idx_trains_status ON trains (status);
CREATE INDEX IF NOT EXISTS idx_weather_reports_created ON weather_reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpis_snapshot ON kpis (snapshot_at DESC);
