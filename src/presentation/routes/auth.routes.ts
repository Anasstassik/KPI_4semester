import { Router } from 'express';
import { LoginUserHandler } from '../../application/handlers/auth/LoginUserHandler';
import { RegisterUserHandler } from '../../application/handlers/auth/RegisterUserHandler';
import { LoginUserQuery } from '../../application/queries/auth/LoginUserQuery';
import { RegisterUserCommand } from '../../application/commands/auth/RegisterUserCommand';
import { UserRepository } from '../../infrastructure/UserRepository';

const authRouter = Router();
const userRepository = new UserRepository();

const loginHandler = new LoginUserHandler(userRepository);
const registerHandler = new RegisterUserHandler(userRepository);

authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const command = new RegisterUserCommand(email, password, role || 'STUDENT');
    const userId = await registerHandler.execute(command);
    res.status(201).json({ id: userId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = new LoginUserQuery(email, password);
    const token = await loginHandler.execute(query);
    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

export { authRouter };