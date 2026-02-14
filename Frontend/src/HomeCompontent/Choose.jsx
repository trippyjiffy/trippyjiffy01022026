import React from "react";
import Style from "../Style/Choose.module.scss";
import { FiCheck, FiPlus, FiZap } from "react-icons/fi";
import ChoseImage from "../Img/ChooseDisk1 (1).webp";

const Choose = ({ darkMode }) => {
  return (
    <div className={`${Style.Choose} ${darkMode ? Style.dark : ""}`}>
      <div className={Style.wrapper}>
        <div className={Style.ChooseDisk}>
          <h2>
            Why <span>Choose Us</span>
          </h2>
        </div>

        <div className={Style.ChooseFlex}>
          <div className={Style.Chooseleft}>
            <h2>Why Choose TrippyJiffy For Your Travel</h2>
            <p>
              We provide customized itineraries, expert local knowledge, and
              24/7 support to make your journey unforgettable.
            </p>
          </div>
          <div className={Style.ChooseRight}>
            <img src={ChoseImage} alt="Choose Us" />
          </div>
        </div>
        <div className={Style.ChooseExpert}>
          <div className={Style.ChooseKnow}>
            <h2>
              <FiCheck />
            </h2>
            <h3>Expertise at Every Destination</h3>
            <p>Deep understanding of Indian destinations and culture</p>
          </div>
          <div className={Style.ChooseKnow}>
            <h2>
              <FiPlus />
            </h2>
            <h3>Tailor Made Tours</h3>
            <p>Customized itineraries to match your preferences</p>
          </div>
          <div className={Style.ChooseKnow}>
            <h2>
              <FiZap />
            </h2>
            <h3>24/7 Support</h3>
            <p>Round-the-clock assistance throughout your journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
