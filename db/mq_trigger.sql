CREATE OR REPLACE FUNCTION mq_trigger() RETURNS trigger AS $$  
BEGIN  
    PERFORM pg_notify('projects', row_to_json(NEW)::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projectsafter AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE PROCEDURE mq_trigger();