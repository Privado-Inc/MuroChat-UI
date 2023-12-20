# Chat Application

Welcome to the MuroChat, a project that allows users to engage in real-time conversations. This application provides a user interface similar to Chat GPT UI. Feel free to contribute by creating bug reports, suggesting improvements, or completing any listed tasks.

## Branch Organization

To maintain an organized development process in this project, it is recommended to follow these guidelines:

- **main:** The primary branch where all production-ready code is stored.
- **feature/{branch-name}:** Create a new branch from `main` for each new feature or improvement. Make sure the branch name is descriptive of the changes you are making.
- Submit all changes by creating a pull request to the `main` branch. We do our best to keep `main` in good shape, with all tests passing.
- Code that lands in `main` must be compatible with the latest stable release. It may contain additional features, but no breaking changes. 
- We should be able to release a new minor version from the tip of `main` at any time.

## Bug Reports, Improvements, and Tasks

If you encounter any bugs or have ideas for improvements, please check the [GitHub Issues](https://github.com/Privado-Inc/private-gpt-ui/issues) section to see if it has already been reported or suggested. If not, feel free to create a new issue with detailed information about the bug or improvement you have in mind.

## Your First Pull Request

If you are new to this project and would like to contribute, we recommend starting with a simple task or bug fix. Here's a step-by-step guide to assist you:

1. Fork the repository to your GitHub account.
2. Clone the forked repository to your local machine.
3. Create a new branch from `main` using a descriptive branch name.
4. Make the necessary changes, ensuring that you follow the established [style guide](#style-guide).
5. Commit your changes with a descriptive commit message.
6. Push the branch to your remote forked repository.
7. Open a pull request from your branch to the main repository's `main` branch.
8. Provide a clear description of the changes made in the pull request, mentioning any related issues using the GitHub issue link.

## Sending a Pull Request

To contribute with code changes, follow the steps below:

1. Ensure you have completed the necessary work on a separate branch.
2. Commit your changes locally with descriptive commit messages.
3. Push the branch to your remote forked repository.
4. Open the [Pull Requests](https://github.com/Privado-Inc/private-gpt-ui/pulls) section of the main repository.
5. Click on "New Pull Request" button.
6. Select the branch containing your changes from your forked repository.
7. Provide a clear title and description for your pull request, explaining the changes made and any relevant information.
8. If your pull request relates to any existing issue, mention the issue number in the description using the GitHub issue link.

## Development Workflow

To ensure a consistent development workflow, follow these guidelines:

- Formatting: We use Prettier to maintain consistent code formatting. Before creating a pull request, please run the following command using yarn: `yarn lint`. This will automatically format your code and identify any linting errors.

### Style Guide

Please make sure to follow the style guide outlined below:

- Code formatting: Use Prettier to ensure consistent code formatting.
- Linting: Run `yarn lint` before creating a pull request to identify any linting errors.
- Detailed comments: Add informative comments to your code to improve readability and maintainability.

We appreciate your interest in contributing to the MuroChat Application! If you have any further questions or need assistance, feel free to reach out.

Happy coding!
