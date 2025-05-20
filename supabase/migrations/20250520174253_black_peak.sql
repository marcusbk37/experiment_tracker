USING (
    EXISTS (
      SELECT 1 FROM experiments
      WHERE experiments.id = experiment_steps.experiment_id
      AND experiments.user_id = auth.uid()
    )
  );