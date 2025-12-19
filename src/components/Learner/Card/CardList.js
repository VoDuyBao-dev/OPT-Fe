import React, { useState } from "react";
import ClassCard from "../ClassCard/ClassCard";
import TutorFormModal from "../TutorModal/TutorFormModal";
import "./TutorDetail.scss";

const ClassList = ({ classes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleRegister = (classInfo) => {
    setSelectedClass(classInfo);
    setIsModalOpen(true);
  };

  return (
    <div className="class-list">
      {classes.map((cls, idx) => (
        <ClassCard
          key={idx}
          {...cls}
          onRegister={() => handleRegister(cls)}
        />
      ))}

      <TutorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classInfo={selectedClass}
      />
    </div>
  );
};

export default ClassList;
