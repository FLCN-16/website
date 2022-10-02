import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

// Components
import Section from '..';

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
}


const WorkedOnSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const projects: Project[] = [
    {
      id: '1',
      title: 'Guardian.Services',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: '/assets/projects/guardian-services-thumb.jpg',
      link: 'https://guardian.services',
    },
    {
      id: '2',
      title: 'AEGIS AV CABINETS',
      description:
        'An USA Reseller website.',
      image: '/assets/projects/aegis-av-thumb.jpg',
      link: 'https://aegisav.com',
    },
  ];

  return (
    <Section title="Worked On">
      <div className="flex flex-wrap container mx-auto">
        {projects.map((project) => (
          <div key={project.id} className="w-full md:w-1/3 lg:w-1/4 p-4">
            <motion.div
              layoutId={project.id}
              className="relative flex bg-gray-50 rounded-lg shadow-md cursor-pointer bg-cover h-48"
              style={{ backgroundImage: `url(${project.image})` }}
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelectedProject(project)}
            >
              <motion.h5 className='hidden'>{project.title}</motion.h5>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen"
            style={{ zIndex: 1000, background: 'rgba(0,0,0,0.75)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              layoutId={selectedProject.id}
              className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
              style={{ maxWidth: '768px', width: '90%' }}
              onClick={() => setSelectedProject(null)}
            >
              <div className="relative flex">
                <Image src={selectedProject.image} width={768} height={432} />

                <div
                  className="absolute flex justify-between bottom-0 left-0 w-full p-4"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.5))',
                  }}
                >
                  <motion.h5 className="text-2xl text-white z-100">
                    {selectedProject.title}
                  </motion.h5>

                  <a
                    href={selectedProject.link}
                    className="text-white bg-gray-500 rounded px-4 py-1"
                    target="_blank" rel="noreferrer"
                  >
                    Visit
                  </a>
                </div>
              </div>

              <div className="p-4">
                <motion.p>{selectedProject.description}</motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

export default WorkedOnSection;