import styled from 'styled-components';


interface ISectionProps {
  label: string;
}

export const Section = styled.section.attrs({
  className: 'section relative py-16',
})<ISectionProps>`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &::before {
    content: '${(props) => props.label}';
    position: absolute;
    top: 0;
    left: 0;
    font-size: 16rem;
    font-weight: bold;
    white-space: nowrap;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.02);
  }
`;

export const SectionHeader = styled.header.attrs({
  className: 'section-header flex justify-center',
})``;

export const SectionTitle = styled.h2.attrs({
  className: 'text-4xl font-normal tracking-wide text-center uppercase',
})`
  display: block;
  margin-bottom: 1rem;
`;

export const SectionContentWrapper = styled.div.attrs({
  className: 'section-content-wrapper',
})``;

export const SectionContent = styled.div.attrs({
  className: 'section-content',
})``;