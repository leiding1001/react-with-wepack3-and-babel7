/**
 * 中间件 - API主入口
 */
import Express from 'express';

import {responseClient} from './util';

const router = Express.Router();

router.get('/ws/test-api', function (req, res) {
  responseClient(res, 200, 1000, {
    id: "1EA9214EB1EA7811"
  });
});


module.exports = router;