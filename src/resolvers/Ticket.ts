import "reflect-metadata";
import { Ticket } from "../entities/Ticket";
import { MyContext } from "src/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class TicketResolver {
  @Query(() => [Ticket])
  /**
   * Gets all the tickets from db
   */
  tickets(@Ctx() { em }: MyContext): Promise<Ticket[]> {
    return em.find(Ticket, {});
  }

  @Query(() => Ticket, { nullable: true })
  ticketById(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Ticket | null> {
    return em.findOne(Ticket, { id });
  }

  @Mutation(() => Ticket)
  async createTicket(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Ticket> {
    const newTicket = em.create(Ticket, {
      title,
    });
    await em.persistAndFlush(newTicket);
    return newTicket;
  }
  @Mutation(() => Ticket)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Ticket | null> {
    const ticket = await em.findOne(Ticket, { id });
    if (!ticket) {
      return null;
    }
    ticket.title = title;
    await em.persistAndFlush(ticket);
    return ticket;
  }
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Ticket, { id });
    } catch (error) {
      return false;
    }
    return true;
  }
}
