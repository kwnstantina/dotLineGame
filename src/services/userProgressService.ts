import firestore from '@react-native-firebase/firestore';

// ...existing code...

export async function savePuzzleCompletion(
  userId: string,
  packId: string,
  puzzleId: string,
  completionDetail: {
    completed: boolean;
    completionTime?: number;
    moves?: number;
    // ...add more fields as needed...
  }
): Promise<void> {
  const userProgressRef = firestore().collection('userProgress').doc(userId);
  await userProgressRef.set(
    {
      [`puzzleCompletions.${packId}.${puzzleId}`]: completionDetail
    },
    { merge: true }
  );
}

// ...existing code...