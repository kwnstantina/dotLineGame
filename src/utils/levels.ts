import {colors} from '../theme/colors';


 export const getDifficultyLevel = (size: number) => {
    if (size <= 3) {return 'Beginner';}
    if (size <= 5) {return 'Intermediate';}
    if (size <= 7) {return 'Advanced';}
    return 'Expert';
  };

  export const getDifficultyColor = (size: number) => {
    if (size <= 3) {return colors.feedback.success;}
    if (size <= 5) {return colors.feedback.warning;}
    if (size <= 7) {return colors.feedback.error;}
    return colors.interactive.accent;
  };