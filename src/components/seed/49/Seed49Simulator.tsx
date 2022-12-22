import { SeedMobData } from '@data/seed/49';
import Seed49SimulatorContent from '@components/seed/49/Seed49SimulatorContent';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { ChevronRightRounded, PlayArrowRounded, RestartAltRounded } from '@mui/icons-material';
import useWeightedQuestions from '@hooks/useWeightedQuestions';

interface Seed49SimulatorProps {
    data: SeedMobData[];
}

const Seed49Simulator = ({ data }: Seed49SimulatorProps) => {
    const { t } = useTranslation(['common', 'seed49', 'seed49simulator']);
    const [mobs, setMobs] = useState<SeedMobData[]>([]);
    const [num, setNum] = useState(0);
    const [openRestartModal, setOpenRestartModal] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { getNum, setCorrect, setIncorrect, resetWeights } = useWeightedQuestions(8);

    const handleNext = () => {
        setNum(getNum());
    };

    const handlePlay = () => {
        const questionAnswers = data.sort(() => Math.random() - 0.5);
        setMobs(questionAnswers);
        setNum(0);
        resetWeights(questionAnswers);
        setIsPlaying(true);
    };

    const handleRestart = () => {
        handleCloseRestart();
        setIsPlaying(false);
    };

    const handleOnRight = (response: string, num: number) => {
        setCorrect(num);
    };

    const handleOnWrong = (response: string, num: number) => {
        setIncorrect(num);
    };

    const handleCloseRestart = () => setOpenRestartModal(false);

    return (
        <>
            <Card elevation={0} variant={'outlined'}
                  sx={{ width: '100%' }}>
                <CardContent sx={{ paddingBottom: 0 }}>
                    {
                        isPlaying ? (
                            <>
                                <Seed49SimulatorContent mob={mobs[num]} 
                                                        key={mobs[num].name} 
                                                        num={num} 
                                                        onRight={handleOnRight}
                                                        onWrong={handleOnWrong} 
                                />
                            </>
                        ) : (
                            <Grid container spacing={2} alignItems={'center'}>
                                <Grid item xs={12}>
                                    <Button onClick={handlePlay}
                                            variant={'contained'}
                                            disableElevation
                                            startIcon={<PlayArrowRounded />}
                                            sx={{ width: '100%' }}>
                                        {t('start')}
                                    </Button>
                                </Grid>
                            </Grid>
                        )
                    }
                </CardContent>
                {
                    isPlaying && (
                        <>
                            <CardActions sx={{ justifyContent: 'space-between' }}>
                                <Button onClick={() => setOpenRestartModal(true)}
                                        startIcon={<RestartAltRounded />}>{t('restart')}</Button>
                                <Button id={'response-4'} onClick={handleNext}
                                        endIcon={<ChevronRightRounded />}>{t('next')}</Button>
                            </CardActions>
                            <Dialog open={openRestartModal} onClose={handleCloseRestart}>
                                <DialogTitle>{t('title', { ns: 'seed49simulator' })}</DialogTitle>
                                <DialogContent>
                                    {t('restartConfirm', { ns: 'seed49simulator' })}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseRestart}>{t('cancel')}</Button>
                                    <Button variant={'contained'} disableElevation
                                            onClick={handleRestart}>{t('restart')}</Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    )
                }
            </Card>
        </>
    );
};
export default Seed49Simulator;