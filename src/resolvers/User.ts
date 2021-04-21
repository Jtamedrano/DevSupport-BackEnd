import "reflect-metadata";
import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session._userId) {
      return null;
    }
    const user = await User.findOne(req.session._userId);
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [{ field: "username", message: "username is not long enough" }],
      };
    }
    if (options.password.length <= 2) {
      return {
        errors: [{ field: "password", message: "password is not long enough" }],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    try {
      const user = await User.create({
        username: options.username.toLowerCase(),
        password: hashedPassword,
      }).save();
      req.session._userId = user.id;
      return {
        user,
      };
    } catch (error) {
      if (error.code === "23505" || error.detail.includes("already exist")) {
        return {
          errors: [{ field: "username", message: "username already taken" }],
        };
      }
      console.log(error);
      return {
        errors: [{ field: "unknown", message: error.message }],
      };
    }
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      username: options.username.toLowerCase(),
    });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "username doesn't exist",
          },
        ],
      };
    }

    const validPassword = await argon2.verify(user.password, options.password);
    if (!validPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "invalid login",
          },
        ],
      };
    } else {
      req.session._userId = user.id;
      return { user };
    }
  }
}
