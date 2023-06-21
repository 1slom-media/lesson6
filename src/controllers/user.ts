import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { hashed } from '../utils/hashed';
import { sign } from '../utils/jwt';
import { compare } from '../utils/compare';
import { UsersEntity } from '../entities/Users';
import createMQProducer from '../producer';

class StaffController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(UsersEntity).find());
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(UsersEntity).findOneBy({ id: +id }));
    }

    public async SignUp(req: Request, res: Response) {
        let { username, email, password } = req.body
        password = await hashed(password);

        const AMQP_URL = "amqp://localhost"
        const QUEUE_NAME = "eventqueue"


        const msg = {
            action: 'REGISTER',
            data: { username, email, password },
        }
        createMQProducer(AMQP_URL, QUEUE_NAME, JSON.stringify(msg))




        const user = await AppDataSource.getRepository(UsersEntity).createQueryBuilder().insert().into(UsersEntity).values({ username, email, password }).returning("*").execute()

        res.json({
            status: 201,
            message: "user created",
            data: user.raw[0]
        })
    }

    public async SignIn(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
                where: { email }
            })
            if (foundUser) {
                if (await compare(password, foundUser.password) == true) {
                    const AMQP_URL = "amqp://localhost"
                    const QUEUE_NAME = "eventqueue"

                    const msg = {
                        action: 'LOGIN',
                        data: { email, password },
                    }

                    createMQProducer(AMQP_URL, QUEUE_NAME, JSON.stringify(msg))


                    return res.json({
                        status: 200,
                        message: "User login successful",
                        token: sign({ id: foundUser.id }),
                        data: foundUser
                    })
                } else {
                    res.status(401).json({
                        status: 401,
                        message: "wrong email or password",
                        token: null,
                    })
                }
            } else {
                res.status(401).json({
                    status: 401,
                    message: "wrong email or password",
                    token: null,
                })
            }

        } catch (error) {
            console.log(error);
        }
    }

}

export default new StaffController();

