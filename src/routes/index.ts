import { Router } from 'express';
import largePersonGroupsController from '../controllers/largePersonGroups';
// import peopleController from '../controllers/people';
const router = Router();

router.post('/largePersonGroups', largePersonGroupsController.create);
router.route('/largePersonGroups/').get(largePersonGroupsController.get).delete(largePersonGroupsController.delete);

router.post('/largepersongroups/:largePersonGroupId/train', largePersonGroupsController.train);

export default router;
