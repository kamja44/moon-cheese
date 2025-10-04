import type { GradePointResponse, UserInfoResponse } from '@/types';
import { http } from '@/utils/http';
import { useEffect, useState } from 'react';

type GradePoint = GradePointResponse['gradePointList'][number];

export function useUserGrade() {
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [gradePoints, setGradePoints] = useState<GradePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserGrade = () => {
    setLoading(true);
    setError(null);

    Promise.all([http.get<UserInfoResponse>('/api/me'), http.get<GradePointResponse>('/api/grade/point')])
      .then(([user, grades]) => {
        setUserInfo(user);
        setGradePoints(grades.gradePointList);
      })
      .catch(err => {
        console.error('등급 정보 조회 실패:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserGrade();
  }, []);

  return { userInfo, gradePoints, loading, error, refetch: fetchUserGrade };
}
