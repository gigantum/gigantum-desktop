import {
  CHECKING,
  INSTALL_DOCKER,
  CONFIGURE_DOCKER,
  CONFIGURE_GIGANTUM,
  INSTALL_COMPLETE,
  ERROR
} from '../../machine/InstallerConstants';

export default {
  [CHECKING]: [
    {
      question: 'What is Docker?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      question: 'Why do I need to install Docker?',
      answer: 'asdassad'
    },
    {
      question: 'Can I run Gigantum without Docker?',
      answer: 'asdassad'
    }
  ],
  [INSTALL_DOCKER]: [
    {
      question: 'What is Docker?',
      answer: '1'
    },
    {
      question: 'Why do I need to install Docker?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      question: 'Can I run Gigantum without Docker?',
      answer: '3'
    }
  ],
  [CONFIGURE_DOCKER]: [
    {
      question: 'Why is this needed?',
      answer: 'asdassad'
    },
    {
      question: 'How do I configure Docker myself?',
      answer: 'asdassad'
    },
    {
      question: 'What is the default configuration?',
      answer: 'asdassad'
    }
  ],
  [CONFIGURE_GIGANTUM]: [
    {
      question: 'Why is this needed?',
      answer: 'asdassad'
    },
    {
      question: 'How do I configure Docker myself?',
      answer: 'asdassad'
    },
    {
      question: 'What is the default configuration?',
      answer: 'asdassad'
    }
  ],
  [INSTALL_COMPLETE]: [
    {
      question: 'Why is this needed?',
      answer: 'asdassad'
    },
    {
      question: 'How do I configure Docker myself?',
      answer: 'asdassad'
    },
    {
      question: 'What is the default configuration?',
      answer: 'asdassad'
    }
  ],
  [ERROR]: [
    {
      question: 'How is storage used?',
      answer: 'asdassad'
    },
    {
      question: 'Why is so much storage required?',
      answer: 'asdassad'
    },
    {
      question: 'What can I do if I don’t have enough space?',
      answer: 'asdassad'
    }
  ]
};
