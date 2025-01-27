import { useCallback } from 'react';
import { TitleCard } from '@components/card';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { MonsterLifeRecipe, monsterLifeRecipes } from '@data/farm/recipes';
import VirtualizedFixedList from '@components/virtualized-list/VirtualizedFixedList';
import useWindowDimensions from '@hooks/useWindowDimensions';
import { isHangulMatching } from '@tools/string';
import { Seo, SeoProps } from '@components/seo';
import { MobCard } from '@components/card/monster-life';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Comments } from '@components/comments';

const seoProps: SeoProps = {
    title: '몬스터 라이프 - 조합식',
    keywords: ['몬스터 라이프', '몬라', '와르', '젬', '조합', '레시피', '농장', '농린이', '몬스터', '라이프'],
    description: '몬스터라이프 모든 스페셜 몬스터의 조합식 정리',
    image: '/images/combine.png',
};

interface FarmCombineProps {
    recipes: Required<MonsterLifeRecipe>[];
}

const SCREEN_HEIGHT_OFFSET = 330;

const RecipeItem = (props: Required<MonsterLifeRecipe>) => {
    const { mob, parents: [left, right] } = props;

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <MobCard mob={mob} />
                </Grid>
                <Grid item xs={4}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Typography variant={'h4'} component={'div'} align={'center'}>=</Typography>
                        <MobCard mob={left} />
                    </Stack>
                </Grid>
                <Grid item xs={4}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Typography variant={'h4'} component={'div'} align={'center'}>+</Typography>
                        <MobCard mob={right} />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

const FarmCombine = (props: FarmCombineProps) => {
    const { recipes } = props;
    const { height } = useWindowDimensions();

    const rowRenderer = useCallback((item: Required<MonsterLifeRecipe>) => <RecipeItem {...item} />, []);

    const searchFilter = useCallback((item: Required<MonsterLifeRecipe>, pattern: string) => {
        return isHangulMatching(pattern, item.mob.name, item.mob.category, ...item.parents.map(p => p.name), ...item.parents.map(p => p.category));
    }, []);

    return (
        <>
            <Seo {...seoProps} />
            <TitleCard title={'몬스터 라이프 스페셜 조합'} />
            <Card variant={'outlined'}>
                <CardContent>
                    <VirtualizedFixedList items={recipes}
                                          height={height - SCREEN_HEIGHT_OFFSET}
                                          rowSize={256}
                                          placeholder={'몬스터 이름, 카테고리 검색 (예: 각성한 락 스피릿, ㄳㅎㄽㅍㄹ, 악마, ㅇㄹㄷㅅ...) [Ctrl] + [F] 또는 [F3]으로 포커싱, 초성 검색 ✅'}
                                          searchFilter={searchFilter}
                                          rowRenderer={rowRenderer} />
                </CardContent>
            </Card>
            <Comments pageKey={'monster-life_combine'} />
        </>
    );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
            recipes: monsterLifeRecipes,
        },
    };
};

export default FarmCombine;