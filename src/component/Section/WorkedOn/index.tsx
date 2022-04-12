import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import Section from '..';


const WorkedOnSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

  return (
    <Section title="Worked On">
      <div className="flex flex-wrap container mx-auto">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4">
          <motion.div
            layoutId="guardian"
            className="flex bg-gray-50 p-5 rounded-lg shadow-md cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => setSelectedProject('guardian')}
          >
            Guardian Services
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen"
            style={{ zIndex: 1000, background: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={selectedProject}
              className="flex flex-col bg-white w-full md:w-1/2 rounded-lg shadow-lg p-6"
              onClick={() => setSelectedProject(null)}
            >
              <motion.h5>Guardian Live</motion.h5>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

export default WorkedOnSection;