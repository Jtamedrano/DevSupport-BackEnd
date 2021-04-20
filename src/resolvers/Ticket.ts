import "reflect-metadata";
import { Ticket } from "../entities/Ticket";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class TicketResolver {
  @Query(() => [Ticket])
  /**
   * Gets all the tickets from db
   */
  tickets(): Promise<Ticket[]> {
    return Ticket.find();
  }

  @Query(() => Ticket, { nullable: true })
  ticketById(@Arg("id") id: number): Promise<Ticket | undefined> {
    return Ticket.findOne(id);
  }

  @Mutation(() => Ticket)
  async createTicket(@Arg("title") title: string): Promise<Ticket> {
    return Ticket.create({
      title,
    }).save();
  }

  @Mutation(() => Ticket)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string
  ): Promise<Ticket | undefined> {
    const ticket = await Ticket.findOne(id);
    if (!ticket) {
      return undefined;
    }
    if (typeof title !== undefined) {
      await Ticket.update({ id }, { title });
    }
    return Ticket.findOne(id);
  }
  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    try {
      await Ticket.delete(id);
    } catch (error) {
      return false;
    }
    return true;
  }
}
