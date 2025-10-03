import { Box, Flex, styled } from 'styled-system/jsx';
import { ProgressBar, Spacing, Text } from '@/ui-lib';
import { useEffect, useState } from 'react';
import { http, type GradePointResponse, type UserInfoResponse } from '@/utils/http';
import ErrorSection from '@/components/ErrorSection';

type GradePoint = {
  type: 'EXPLORER' | 'PILOT' | 'COMMANDER';
  minPoint: number;
};

function CurrentLevelSection() {
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [gradePoints, setGradePoints] = useState<GradePoint[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([http.get<UserInfoResponse>('/api/me'), http.get<GradePointResponse>('/api/grade/point')])
      .then(([user, grades]) => {
        setUserInfo(user);
        setGradePoints(grades.gradePointList);
      })
      .catch(err => {
        console.error('등급 정보 로딩 실패:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 로딩 중
  if (loading) {
    return (
      <styled.section css={{ px: 5, py: 4 }}>
        <Text variant="H1_Bold">현재 등급</Text>
        <Spacing size={4} />
        <Text>로딩 중...</Text>
      </styled.section>
    );
  }

  // 에러 처리
  if (error) {
    return (
      <styled.section css={{ px: 5, py: 4 }}>
        <ErrorSection onRetry={() => window.location.reload()} />
      </styled.section>
    );
  }

  if (!userInfo || gradePoints.length === 0) {
    return null;
  }

  // 다음 등급까지 계산
  const getNextGradeInfo = () => {
    const { point, grade } = userInfo;

    // 현재 등급
    const currentGradeIndex = gradePoints.findIndex(g => g.type === grade);

    // 마지막 등급
    if (currentGradeIndex === gradePoints.length - 1) {
      return {
        remaining: 0,
        progress: 1,
        nextGrade: 'MAX',
      };
    }

    // 다음 등급 정보
    const currentGrade = gradePoints[currentGradeIndex];
    const nextGrade = gradePoints[currentGradeIndex + 1];

    const currentPoint = currentGrade.minPoint;
    const nextPoint = nextGrade.minPoint;

    // 남은 포인트
    const remaining = nextPoint - point;

    // 진행률
    const progress = (point - currentPoint) / (nextPoint - currentPoint);

    return {
      remaining,
      progress: Math.max(0, Math.min(1, progress)),
      nextGrade: nextGrade.type,
    };
  };
  const nextInfo = getNextGradeInfo();

  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />

      <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
        <Flex flexDir="column" gap={2}>
          <Text variant="H2_Bold">{userInfo.grade}</Text>

          <ProgressBar value={nextInfo.progress} size="xs" />

          <Flex justifyContent="space-between">
            <Box textAlign="left">
              <Text variant="C1_Bold">현재 포인트</Text>
              <Text variant="C2_Regular" color="neutral.03_gray">
                {userInfo.point}p
              </Text>
            </Box>
            <Box textAlign="right">
              <Text variant="C1_Bold">다음 등급까지</Text>
              <Text variant="C2_Regular" color="neutral.03_gray">
                {nextInfo.remaining}p
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </styled.section>
  );
}

export default CurrentLevelSection;
