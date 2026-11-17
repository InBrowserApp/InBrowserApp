CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active'
);
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  title TEXT NOT NULL,
  estimate REAL,
  notes TEXT,
  attachment BLOB
);
CREATE INDEX tasks_project ON tasks(project_id);
INSERT INTO projects VALUES
  (1, 'Website refresh', 'active'),
  (2, 'Customer research', 'complete'),
  (3, '工具箱 · Toolbox', 'active');
INSERT INTO tasks VALUES
  (1, 1, 'Review accessible navigation', 2.5, NULL, X'89504e470d0a1a0a'),
  (2, 1, 'Test mobile layouts', 1.5, 'Check 390px and 768px viewports', NULL),
  (3, 2, 'Summarize interviews', 4, 'A quote: "Keep it simple"', NULL),
  (9007199254740993, 3, 'Preserve large integer identifiers', 0.5, 'Exact 64-bit integer example', NULL);
CREATE VIEW project_summary AS
SELECT p.name, COUNT(t.id) AS task_count, SUM(t.estimate) AS total_hours
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
GROUP BY p.id;
