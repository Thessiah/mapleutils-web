import { useState } from 'react';

const useWeightedQuestions = (initialWeight: number) => {
    const initializeWeights = (questions: any[]) => questions.map(() => initialWeight);
    const initializeTotalWeight = (questions: any[]) => questions.length * initialWeight;
    const [weights, setWeights] = useState<number[]>([]);
    const [totalWeight, setTotalWeight] = useState<number>(0);
    console.log({ weights, totalWeight});
    const getNum = () => {
        let weightedNum: number = Math.floor(Math.random() * totalWeight);
        let num: number = 0;
        while(weightedNum >= 0) {
            weightedNum -= weights[num];
            num++;
        }
        console.log({
            weights, totalWeight,
            weightedNum, num
        })
        return num - 1;
    };
    const setCorrect = (num: number) => {
        const weight = weights[num];
        const newWeight = weight > 2 ? weight / 2 : weight;
        setTotalWeight((currTotalWeight) => currTotalWeight + (newWeight - weight));
        setWeights((currWeights) => currWeights.map((val, index) => index === num ? newWeight : val));
    };
    const setIncorrect = (num: number) => {
        const weight = weights[num];
        const newWeight = weight * 2;
        setTotalWeight((currTotalWeight) => currTotalWeight + (newWeight - weight));
        setWeights((currWeights) => currWeights.map((val, index) => index === num ? newWeight : val));
    };
    const resetWeights = (questions: any[]) => {
        setTotalWeight(initializeTotalWeight(questions));
        setWeights(initializeWeights(questions));
    };
    return { getNum, setCorrect, setIncorrect, resetWeights };
};

export default useWeightedQuestions;