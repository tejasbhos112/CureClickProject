import React from "react";
import { useParams } from "react-router";
import Header from "./Header";

const ConsultJoin = () => {
  const { appointmentId } = useParams();
  return (
    <>
      <Header />
     <h2>ConsultJoin </h2>
    </>
  );
};

export default ConsultJoin;


