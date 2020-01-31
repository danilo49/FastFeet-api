import jwt from 'jsonwebtoken'; // JWT authentication
import { promisify } from 'util'; // standard node library, convert the callback function to a function that can be worked in asynchronous mode
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');
  // const [bearer, token] = authHeader.split(' ');
  // EXAMPLE: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTgwMzE2NDY0LCJleHAiOjE1ODA5MjEyNjR9.2nUdw-mQwc5RExPqF1yeHtRnD9YJcgCtMl5g_5qdh-0
  // split token bearer in two-position array

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // The jwt id is inside the decoded now

    console.log(decoded); // { id: 5, iat: 1580316464, exp: 1580921264 } exp = expiration format unix

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
