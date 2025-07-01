User end points: `{BaseURL}/user`
- POST : To create user.
- GET: To get user.
- DELETE (id): Delete user.
- GET (id): Get an user with id.

Projects: `{Base url}/project`
- POST :  To create a project.
- GET (id): To get a project using id.
- GET: To get all projects .
- PUT (id): To update an user using id.

WorkItems: `{Base url}/workitem`
- POST: To create a workitem.
- Query parameters:
	- GET (id): Get an workitem using id.
	- GET (type): Get an workitem using types.
	- GET (assign_to): Get an workitem by using assignee.
	- GET (states): Get an workitem by using states.
	- GET(Area): Get an workitem by using area
	- GET (tags): Filter workitem using tags
	- GET (recently_updated): Filter it by recently updated workitems.
	- GET (recently_completed): Filter it by recently completed workitems.
	- GET (recently_created): Filter it by recently created workitems.
	- GET (keyword): Filter it by keywords.
- GET: To get all workitems.
- PUT (id): To update a workitem by using it's id.
- DELETE (id): To delete a workitem by using id.


Discussion: `{Base url}/discussion`
 - POST: To create a single comment.
 - GET (workitem_id): To get all comments in a workitem.
 - PUT (workitemid/commentid): To update a comment using an id.

Tag: `{Base url}/tag`
- POST: To create a single tag.
- DELETE (id): To delete a single tag / selected tag. 
- GET (workitem_id): Get all tags by woritem id.

Project member: `{Base url}/project_members`
- GET (id): To get project members of particular project.
- POST: Add new member to a project.
- PUT (user_id): To edit the role of the project member
- DELETE (user_id): To remove an user from a project membership. 

Sprint: `{Base url}/sprint`
- GET: All listed sprints
- DELETE (id): Delete a sprint by using sprint id.
- POST: To create a sprint in sprint table





## Note:
- Need to validate project id whether it is available or not.
- Need to validate the user before creating the project.




