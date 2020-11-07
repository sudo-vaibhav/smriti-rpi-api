import { Router } from 'express';
import largePersonGroupsController from '../controllers/largePersonGroups';
import peopleController from '../controllers/people';
const router = Router();

router.post('/largePersonGroups', largePersonGroupsController.create);
router.route('/largePersonGroups/').get(largePersonGroupsController.get).delete(largePersonGroupsController.delete);

router.post('/largepersongroups/:largePersonGroupId/train', largePersonGroupsController.train);

router.post('/largepersongroups/persons', peopleController.add);
router.get('/largepersongroups/persons', peopleController.listPeople);
router.post('/largepersongroups/persons/:personId/persistedfaces', peopleController.addFace);
router.delete('/largepersongroups/persons/:personId', peopleController.delete);

router.get('/largepersongroups/identify', peopleController.identify);

export default router;
