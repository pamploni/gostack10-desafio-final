import * as yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class DelivererController {
  async index(req,res) {
    const deliverers = await User.findAll({
      where: { deliverer: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ]
    });

    return res.json(deliverers);
  }
}

export default DelivererController();
