import * as userRepository from '../repositories/user.repository.js';
import { increment } from '../state/request-counter.js';
import { getPublicUsers, initPermissions } from '../services/user.service.js';

initPermissions();

export const getUsers = async (request, reply) => {
  increment();

  const users = await getPublicUsers();
  return { users };
};

const getUserById = async (request, reply) => {
  increment();
  const { id } = request.params;
  const user = await userRepository.findById(id);
  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }
  return { user };
};

export default {
  getUsers,
  getUserById
};
