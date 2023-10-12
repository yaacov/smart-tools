## Contributing to Smart Tools

We welcome contributions and are grateful for the help! Below you’ll find guidelines for setting up a development environment and how to contribute to the Smart Tools project.

### Prerequisites

  - Ensure you have Node.js and npm (Node Package Manager) installed on your system. If not, download and install them from the [Node.js official website](https://nodejs.org/).
  - Familiarity with using Git for cloning and working with repositories.
  - [Optional] Podman installed if you intend to build and run container images. Install it following the guide on the [Podman official website](https://podman.io/getting-started/installation).

### Setting Up Your Development Environment

Contributing to the Smart Tools project involves forking the repository, creating a feature branch on your local setup, and then submitting your contributions via a pull request. Let’s walk through the setup process step-by-step:

#### 1. Fork the Repository

Before you can clone and work with the repository locally, create a fork of the original repository to your own GitHub account. This allows you to make changes without affecting the original project and serves as a place to manage and track your contributions.

  - Navigate to the [Smart Tools Repository on GitHub](https://github.com/yaacov/smart-tools.git).
  - In the top-right corner of the page, click Fork.

You can find more detailed instructions in the GitHub guide on [forking repositories](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

#### 2. Clone Your Fork Locally

Once you've forked the repository, clone your fork, not the original, to your local development environment:

```bash
git clone https://github.com/[YourUsername]/smart-tools.git
cd smart-tools
```

  Replace `[YourUsername]` with your GitHub username.

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Run the Code
Run the tools from the source using Node.js:

```bash
node src/smart-vm.mjs
```

### Working with Container Images
If you’re working with container images, use the following commands to build and run them using Podman:

Build the Container Image
```bash
Copy code
podman build -t quay.io/yaacov/smart-tools .
```

Run the Container Image
```bash
Copy code
podman run -it quay.io/yaacov/smart-tools
```

### Contributing Changes
When you’re ready to contribute:

  - Ensure your code adheres to the existing coding standards and practices.
  - Test your changes and ensure everything works as expected.
  - Submit a pull request and provide a clear description of your changes.

## Further Assistance

If you encounter any issues or need further assistance, check out our issues or submit a new one. Thank you for contributing to Smart Tools!
