import { Migration } from '@mikro-orm/migrations';

export class Migration20210417213112 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "ticket" add column "resolved" bool not null default false;');
  }

}
