import express from 'express';
import serialize from 'node-serialize';

const router = express.Router();

const blockedExpressions = [
  /_\$\$ND_FUNC\$\$_/i,
  /child_process/i,
  /\brequire\b/i,
  /\bexec(?:Sync)?\b/i,
];

router.post('/generate-report', (req, res) => {
  const { config } = req.body;
  
  try {
    if (
      typeof config !== 'string' ||
      blockedExpressions.some((expression) => expression.test(config))
    ) {
      return res.status(422).json({
        error: 'Report configuration contains a restricted expression.',
      });
    }

    // Vulnerable deserialization
    const reportConfig = serialize.unserialize(config);
    
    // Process report configuration
    res.json({ status: 'Report generation started' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
