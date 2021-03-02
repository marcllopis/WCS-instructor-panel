import React, { Fragment } from 'react';
import Button from '../shared/Button';


const ButtonsGroup = props => (
  <Fragment>
    <Button
      action={props.splitInGroups}
      id={2}
      buttonText="Create Pairs"
    />
    <Button
      action={props.splitInGroups}
      id={3}
      buttonText="Create groups of 3"
    />
    <Button
      action={props.splitInGroups}
      id={4}
      buttonText="Create groups of 4"
    />
    <Button
      action={props.splitInGroups}
      id={5}
      buttonText="Create groups of 5"
    />
  </Fragment>
);

export default ButtonsGroup;