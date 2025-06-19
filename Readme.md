## Epic feature (Azure devops) - CRUD App

*Database schema*

![Database schema](Images/Schema-Image.png)

*ORM's choices*
### TypeORM
- Official NestJS integration (`@nestjs/typeorm`)
- Verbose syntax with decorators
- Known for bugs and inconsistent behavior in community discussions
- Currently lacking active maintainers; in maintenance mode

### Prisma
- Strongly typed with excellent developer experience
- Actively maintained with comprehensive documentation
- Integrates well with NestJS using custom providers
- Some performance overhead in complex queries

### Drizzle ORM
- TypeScript-first, very fast, no code generation required
- Fully type-safe and minimalistic
- No official NestJS integration; requires manual setup
- Still new with a smaller ecosystem

### MikroORM
- Fully typed and performs well
- Clean NestJS integration via `@mikro-orm/nestjs`
- Actively maintained and gaining popularity
- Less widely adopted but highly recommended by the community

## Second review
Changes in project:

Variable - camel case
Class name - pascal case
Postgres - snake case
Entity - singular
table name - plural

Enum - best practices (naming)

Error handling - dto, controller

API documentations:
Swagger


## Third review

- [x] User table: User , email, etc...
- [x] Relation
- [x] Project table
- [x] Boards table
- [x] Sprints table
- [x] Epic extends workitem
- [ ] Attachments table used by (comment section)
- [x] Have a base class for all the work items
- [x] Function name : camel case
- [ ] Any end points -> should have 5 standard (get, post, put, delete) endpoints - dynamic queries 
- [ ] Efficient way to serve data to front end
- [ ] Test cases - mock data - test db - possible scenarios - spec file
- [ ] Jwt in nest js. Access token, reference token.
- [ ] Role based access (guards)
- [ ] Api documentation must

| Epic                                                                                                                                                                                                                                                                                                                     | Feature | User story                                  | Task                                                                      | Bug |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------------------------------------------- | ------------------------------------------------------------------------- | --- |
| - Title<br>- State<br>- Reason<br>- Area<br>- Iteration<br>- Tag<br>- Comments<br>- Description<br>- Discussion<br>- Assigne<br>- Planning<br>	- Priority<br>	- Risk<br>	- Effort<br>	- Business Value<br>	- Time Criticality<br>	- StartDate<br>	- Target Date<br>- Classification<br>- Parent (Optional)<br>- Children | ------  | - Acceptance criteria<br>- story points<br> | - Original estimates<br>- Remainig<br>- Completed<br>- Implementation<br> |     |


