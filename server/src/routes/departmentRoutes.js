import { Router } from 'express';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addWorker,
  removeWorker,
  assignIssueToDepartment,
} from '../controllers/departmentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getDepartments);
router.post('/', protect, adminOnly, createDepartment);
router.patch('/:id', protect, adminOnly, updateDepartment);
router.delete('/:id', protect, adminOnly, deleteDepartment);
router.post('/:id/workers', protect, adminOnly, addWorker);
router.delete('/:id/workers', protect, adminOnly, removeWorker);
router.post('/:id/assign-issue', protect, adminOnly, assignIssueToDepartment);

export default router;
