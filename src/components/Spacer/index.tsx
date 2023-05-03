import styled from 'styled-components/native';

type SpacerProps = {
  /** Horizontal space. Multiplier of theme.spacing */
  x?: number;
  /** Vertical space. Multiplier of theme.spacing */
  y?: number;
};

const Spacer = styled.View<SpacerProps>`
  padding-left: ${({x = 0}) => x}px;
  padding-top: ${({y = 0}) => y}px;
`;

export default Spacer;
