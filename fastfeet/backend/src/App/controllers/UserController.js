import * as yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req,res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required().min(6),

    });

    if (!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation Fails'});
    }

    const userExists = await User.findOne({
      where: { email: req.body.email},
    });

    if (userExists) {
      return res.status(400).json({error: 'Error. User already exists!' });

    }

    const {id, name, email, deliverer } = await User.create(req.body);

    return res.json({
      id,
       name,
       email,
       deliverer,
    })

  }


  async update(req,res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      oldPassword: yup.string().email(),
      password: yup.string().required().min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: yup.string()
        .when('password', (password, field) =>
          password ? field.required().oneOf([yup.ref('password')]) : field
        ),

    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { email, oldPassword } = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'Error. User already exists!' });
      }
    }

    if (oldPassword && 1(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password doesnt match!' });
    }

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default UserController();
