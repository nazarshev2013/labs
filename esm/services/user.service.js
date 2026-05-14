import * as userRepository from '../repositories/user.repository.js';
import { formatName } from '../utils/formatter.js';
import rolesMap from '../data/roles.json' with { type: 'json' };

export const initPermissions = () => {
  console.log('Initializing permissions');
};

export const getPublicUsers = async () => {
  const users = await userRepository.findAll();

  return users.map((u) => ({
    id: u.id,
    name: formatName(u.name),
    roleName: rolesMap[u.id] || 'Unknown'
  }));
};

export const getUserFormatted = async (id, reply) => {
  const { default: userController } = await import('../controllers/user.controller.js');
  return userController.getUserById({ params: { id } }, reply);
};
