import React from 'react';
import utils from '../../../libs/utilities';
import {
  CHECKING,
  INSTALL_DOCKER,
  CONFIGURE_DOCKER,
  CONFIGURE_GIGANTUM,
  INSTALL_COMPLETE,
  INSTALL_WSL2,
  ERROR
} from '../../machine/InstallerConstants';

const checkingAndInstall = [
  {
    question: 'What is Docker?',
    answer: (
      <div>
        Docker is a tool to run{' '}
        <span
          role="presentation"
          onClick={() =>
            utils.open('https://www.docker.com/resources/what-container')
          }
        >
          software containers
        </span>
        . Software containers are used to manage your compute environment and is
        what lets your code run on different operating systems.
      </div>
    )
  },
  {
    question: 'Why do I need to install Docker?',
    answer:
      'You must install Docker because the Gigantum Client runs in a container. Additionally all Projects run in their own container.'
  },
  {
    question: 'Can I install Docker myself?',
    answer: (
      <div>
        Gigantum Desktop will walk you through the installation process, but if
        you’d like to do it yourself you can find instructions on{' '}
        <span
          role="presentation"
          onClick={() =>
            utils.open('https://www.docker.com/products/docker-desktop')
          }
        >
          Docker’s website
        </span>{' '}
        and in our{' '}
        <span
          role="presentation"
          onClick={() =>
            utils.open('https://docs.gigantum.com/docs/configuring-docker')
          }
        >
          documentation
        </span>
        .
      </div>
    )
  }
];

export default {
  [CHECKING]: checkingAndInstall,
  [INSTALL_DOCKER]: checkingAndInstall,
  INSTALL_WSL2_KERNEL_INSTALLING: [
    {
      question: 'What is WSL 2?',
      answer:
        'Windows Subsystem for Linux (WSL) is a compatibility layer for running Linux programs natively on Windows 10.'
    },
    {
      question: 'Why do I need WSL 2?',
      answer: 'In Windows, WSL 2 provides a Linux environment to run Docker.'
    },
    {
      question: 'Why update?',
      answer:
        'Kernel updates will soon be automatically handled as part of Windows updates, but currently it is a manual process.'
    }
  ],
  INSTALL_WSL2_KERNEL: [
    {
      question: 'Why is this needed?',
      answer:
        'Linux kernel updates will soon be automatically handled as part of Windows updates, but currently is a manual process.'
    }
  ],
  [INSTALL_WSL2]: [
    {
      question: 'What is WSL 2?',
      answer:
        'Windows Subsystem for Linux (WSL) is a compatibility layer for running Linux programs natively on Windows 10.'
    },
    {
      question: 'What is Hyper-V?',
      answer:
        'Microsoft Hyper-V is a native system to create virtual machines (VM) in Windows. If WSL 2 is not enabled, Docker will run inside a VM managed by Hyper-V.'
    },
    {
      question: 'What should I choose?',
      answer:
        'In most cases you should choose WSL 2 unless you cannot use it (e.g. corporate policy). It is more efficient and the future of Docker Desktop on Windows.'
    }
  ],
  [CONFIGURE_DOCKER]: [
    {
      question: 'Why is this needed?',
      answer:
        'On Mac and Windows, Gigantum will allocate half the available CPU and RAM to Docker for you. Additionally on Mac, half the available hard drive space up to 100GB is allocated. This is a “soft” allocation and is only consumed as data is written during use.'
    },
    {
      question: 'How do I configure Docker myself?',
      answer: (
        <div>
          Follow the instructions in our{' '}
          <span
            role="presentation"
            onClick={() =>
              utils.open('https://docs.gigantum.com/docs/configuring-docker')
            }
          >
            documentation
          </span>{' '}
          to manually configure Docker.
        </div>
      )
    },
    {
      question: 'What is the default configuration?',
      answer:
        'On Mac and Windows, Gigantum will allocate half the available CPU and RAM to Docker for you. Additionally on Mac, half the available hard drive space up to 100GB is allocated. This is a “soft” allocation and is only consumed as data is written during use.'
    }
  ],
  [CONFIGURE_GIGANTUM]: [
    {
      question: 'Why is this needed?',
      answer:
        'The Gigantum Client is delivered in a Docker container that must be downloaded to your computer.'
    }
  ],
  [INSTALL_COMPLETE]: [
    {
      question: 'What do I do next?',
      answer:
        'Start Gigantum, sign in, and open the example “my-first-project” Project to explore, or create your own Project to get started.'
    },
    {
      question: 'When do I need to run Docker?',
      answer:
        'Gigantum Desktop can manage starting and stopping Docker for you. Docker needs to be running while Gigantum is running.'
    },
    {
      question: 'Where can I find examples?',
      answer: (
        <div>
          Check out{' '}
          <span
            role="presentation"
            onClick={() => utils.open('https://gigantum.com/explore')}
          >
            Gigantum Hub
          </span>{' '}
          to find examples and other public Projects and Datasets
        </div>
      )
    }
  ],
  [ERROR]: [
    {
      question: 'How is storage used?',
      answer:
        'Projects, Datasets, and Docker Images consume disk space. Depending on the Project configuration, some images can be quite large (e.g. over 1GB)'
    },
    {
      question: 'Why is there a minimum disk space?',
      answer:
        'This reserves enough disk space to ensure that Docker, the Gigantum Client Docker image, and the demo project image can be installed with some space remaining for your work.'
    },
    {
      question: 'What can I do if I don’t have enough space?',
      answer: (
        <div>
          You can try deleting large files and re-running the install process.
          Additionally, you can{' '}
          <span
            role="presentation"
            onClick={() =>
              utils.open('https://docs.gigantum.com/docs/working-remotely')
            }
          >
            work remotely
          </span>{' '}
          or in{' '}
          <span
            role="presentation"
            onClick={() => utils.open('https://gigantum.com/explore')}
          >
            Gigantum Hub
          </span>
        </div>
      )
    }
  ]
};
