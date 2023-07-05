import React from 'react';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import BranchButton from '../../common/button/branchButton/BranchButton';
import DownloadButton from '../../common/button/downloadButton/downloadButton';
import DescriptionBox from '../../common/box/descriptionBox/descriptionBox';
import ImageBox from '../../common/box/imageBox/imageBox';
import UploadInfoBox from '../../common/box/uploadInfoBox/uploadInfoBox';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMainBranchId } from '../../../hooks/branchSlice';
import { setMainBranchUuid } from '../../../hooks/branchSlice';
import { setProjectId } from '../../../hooks/projectSlice';
import { RootState } from '../../../stores/store';
import FeedbackBox from '../../common/box/feedbackBox/feedbackBox';
import CommentTextBox from '../../common/box/commentTextBox/commentTextBox';

interface recentLogResponse {
  status: number;
  code: string;
  message: string;
  data: recentLogData;
}

interface recentLogData {
  logUuid: string;
}

interface logResponse {
  status: number;
  code: string;
  message: string;
  data: logInfo;
}

interface logInfo {
  userUuid: string;
  logMessage: string;
  logCreatedAt: string;
  logPreview: string;
  resourceInfos: resourcesData[];
}

interface resourcesData {
  resources: resource[];
}

interface resource {
  fileName: string;
  fileLink: string;
  fileUuid: string;
}

interface feedbackData {
  feedbacks: feedback[];
}

interface feedback {
  feedbackUserUuid: string;
  feedbackMessage: string;
  feedbackUuid: string;
}

interface userResponse {
  status: number;
  code: string;
  message: string;
  data: userInfo;
}

interface userInfo {
  userEmail: string;
  userNickname: string;
  userPhoto: string;
  userUuid: string;
  userId: number;
}

interface BranchResponse {
  status: number;
  code: string;
  message: string;
  data: BranchesData;
}

interface BranchesData {
  projectBranchInfos: Branch[];
}

interface Branch {
  branchName: string;
  branchUuid: string;
  branchId: number;
}

export default function Project() {
  const [recentLog, setRecentLog] = useState('');

  let branchUuid = useSelector((state: RootState) => {
    return state.branch.uuid;
  });

  let projectUuid = useSelector((state: RootState) => {
    return state.project.uuid;
  });
  let projectId = useSelector((state: RootState) => {
    return state.project.projectId;
  });

  let mainUuid = useSelector((state: RootState) => {
    return state.branch.mainBranchUuid;
  });

  let mainId = useSelector((state: RootState) => {
    return state.branch.mainBranchId;
  });

  const dispatch = useDispatch();

  const [branchData, setBranchData] = useState<Branch[]>([]);

  useEffect(() => {
    (async () => {
      await axios
        .get<BranchResponse>(
          '/api/v1/projects/' + projectUuid + '/branches?page=0'
        )
        .then((response) => {
          console.log('브랜치 정보 불러오기 성공');
          console.log('가져온 데이터', response.data.data.projectBranchInfos);
          setBranchData(response.data.data.projectBranchInfos);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, [projectUuid]);

  useEffect(() => {
    (async () => {
      await axios
        .get('/api/v1/projects/' + projectUuid)
        .then((response) => {
          console.log('현위치 프로젝트 정보(project.tsx)');
          console.log('가져온 데이터', response.data.data.projectId);
          const idValue = response.data.data.projectId;
          const stringIdValue = idValue.toString();

          console.log('현재 store된 프로젝트 ID : ', projectId);
          dispatch(setProjectId(stringIdValue));
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, [projectUuid]);

  useEffect(() => {
    (async () => {
      await axios
        .get<recentLogResponse>(
          '/api/v1/branches/' + branchUuid + '/logs/recent'
        )
        .then((response) => {
          console.log(' 최근 로그 uuid 불러오기 성공');
          setRecentLog(response.data.data.logUuid);

          axios
            .get<logResponse>('/api/v1/logs/' + recentLog)
            .then((response) => {
              console.log('최근 로그 정보 불러오기 성공');
              console.log(response.data);

              //로그 이미지 API
              console.log(
                '로그 프리뷰 이미지, ',
                response.data.data.logPreview
              );
              setlogPreviewImg(response.data.data.logPreview);

              //로그 생성 시간
              console.log('로그 생성시간 ', response.data.data.logCreatedAt);
              setCreateTime(response.data.data.logCreatedAt);

              //로그 정보의 유저 uuid
              console.log(response.data.data.userUuid);
              axios
                .get<userResponse>(
                  '/api/v1/users/' + response.data.data.userUuid
                )
                .then((response) => {
                  console.log('닉네임 : ', response.data.data.userNickname);
                  setNickname(response.data.data.userNickname);
                });

              //로그 메시지
              console.log('로그 메시지 ', response.data.data.logMessage);
              setLogMessage(response.data.data.logMessage);

              setNoneProduct(false);
            });
        })
        .catch((error) => {
          console.log(' 최근 로그 uuid 불러오기 실패(project.tsx)');
          console.log(error);
        });
    })();
  }, [recentLog]);

  const [message, setLogMessage] = useState('');
  const [logPreviewImg, setlogPreviewImg] = useState('');
  const [createTime, setCreateTime] = useState('');
  const [nickname, setNickname] = useState('');
  const [noneProduct, setNoneProduct] = useState(true);

  branchData.map((branchData) => {
    if (branchData.branchName === 'main') {
      dispatch(setMainBranchId(branchData.branchId.toString()));
      console.log('mainbranchId: ', mainId);
      dispatch(setMainBranchUuid(branchData.branchUuid));
      console.log('mainbranchUuid : ', mainUuid);
    }
  });

  return (
    <Box display='block'>
      <Box sx={{ px: 5, py: 3, alignItems: 'center' }}>
        <BranchButton />
      </Box>
      <Box display='flex' sx={{ flexWrap: 'wrap', pt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 60%',
            maxWidth: 800,
            minWidth: 500,
          }}
        >
          {noneProduct ? (
            <Box sx={{ px: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    maxWidth: 500,
                    width: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <DownloadButton fileLink={''} />
                </Box>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    width: '500px',
                    height: '500px',
                    backgroundColor: '#f4f4f4',
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{ px: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    maxWidth: 500,
                    width: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <DownloadButton fileLink={logPreviewImg} />
                </Box>
              </Box>
              <ImageBox image={logPreviewImg} />
              <UploadInfoBox
                message={message}
                user={nickname}
                createTime={createTime}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ flex: '1 0 40%', minWidth: 250 }}>
          <Box sx={{ pt: 2, px: 5 }}>
            <DescriptionBox />
            <Box sx={{ pt: 6 }}>
              <FeedbackBox />
              <Box sx={{ px: 3, pt: 4 }}>
                <CommentTextBox />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
