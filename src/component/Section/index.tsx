import React from 'react';

import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionContentWrapper,
  SectionContent,
} from './style';


interface ISectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

const SectionComponent: React.FC<ISectionProps> = ({ title, children }) => {
  return (
    <Section label={title}>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
      </SectionHeader>

      <SectionContentWrapper>
        <SectionContent>{children}</SectionContent>
      </SectionContentWrapper>
    </Section>
  );
}

export default SectionComponent;