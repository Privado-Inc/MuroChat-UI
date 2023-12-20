## MuroChat
MuroChat by Privado is an LLM Chat platform with secure, AI-powered communication tailored for employees within enterprises. It's a robust platform that emphasizes productivity and privacy. This README file will guide you through the setup process and explain how to get the application up and running.

### Key Features
- Sensitive Data Redaction with a message firewall.
- Okta Integration for user management.
- Flexible LLM Integration for any open-source or premium models.
- User-Centric Design to manage, pin, share, and bookmark chats.
- Real-Time Admin Oversight for chat monitoring and access control.

### Why MuroChat?
- Focused on Data Privacy with a security-first approach.
- Developer Freedom to choose and customize LLMs and data models.
- Community-Centric Updates for continuous platform enhancement.

### For Employees, By Employees 
- We want to empower every employee to be the best at what they do by leveraging AI without breaking the security fabric of the company. 
- MuroChat is highly modular and open for all to innovate.


### Prerequisites
- `Nodejs` should be installed (recommended >= v16)
- `yarn` should be installed

### Basic Installation
After cloning the repo please follow below commands:
- `yarn install`
- After installation run `yarn start`
- This will run your application over http://localhost:4002/

### Commands for development
MuroChat using Webpack to start the application.
- `yarn start`
- The application is now set up and running on port 4002, and you can access it in your web browser.

### Backend Server Configuration

Before running the application, you need to configure the backend server to connect to the correct repository. Follow the steps below:

1. Locate the `env.qa.js` file in the project directory.
2. Update the file to point to the backend server repository URL.

### Build Commands
We use Webpack to build the application.
- **Production Build:** `yarn run build:prod`
- **QA Build:** `yarn run build:qa`

### Other Commands

`yarn run  <...command>`

|Command     | Uses|
|------------|--------------|
|format      | To Pretify .{js, ts, tsx} files |
|lint        | To run linter over repo  |
|safety-check| To run lint, type check & tests |
|test        | To run tests |
|cirdep      | To check circular dependencies in app |
|tsc         | To run type check |



### [Modules](src/modules)


### Env configurations
- New files are stored in `public/envs` folder


## Okta Setup

In order to use Okta authentication, you need to provide the following information:

1. Okta Client ID
2. Okta Issuer
3. Okta Redirect URI

Please configure these values on the onboarding page which is loaded once you start the application.

### Mapping Okta User Groups

To map Okta user groups, follow the guidelines in the application. In this codebase, the user group `IT Administrator`, `Security Administrator` and `Chat User` are used for mapping.

## Set-up LLM Models

To set up LLM models for use in `MuroChat`, please refer to the relevant documentation or guidelines specific to the models you are working with. Currently it supports Chat GPT and LLAMA 2.

Once the above steps are completed, you are ready to go! 

If you have any questions or need further assistance, please don't hesitate to reach out. Enjoy using MuroChat!

Happy coding!