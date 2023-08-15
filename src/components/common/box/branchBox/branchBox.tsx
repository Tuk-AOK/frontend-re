import { Box, IconButton, Modal, Typography, Button, Input } from "@mui/material";
import { useEffect, useState } from "react";
import axios from 'axios';
import { RootState } from "../../../../stores/store";
import { useSelector } from "react-redux";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BranchEditBox from "../branchEditBox/branchEditBox";


interface BranchResponse{
  status: number;
  code: string;
  message: string;
  data: BranchesData;
}


interface BranchesData{
  projectBranchInfos: Branch[]
}

interface Branch{
  branchName: string;
  branchUuid: string; 
}



export default function BranchBox() {
  const [branchData, setBranchData] = useState<Branch[]>([]);

  const [activeModalBranch, setActiveModalBranch] = useState<Branch | null>(null);


  const handleModalOpen = (branch: Branch) => {
    setActiveModalBranch(branch);
  };

  const handleModalClose = () => {
    setActiveModalBranch(null);
  };
  
  let projectUuid = useSelector((state: RootState)=>{
    return state.project.uuid;  
  });

  useEffect(() => {
    (async () => {
        await axios.get<BranchResponse>('/api/v1/projects/'+ projectUuid +'/branches?page=0')
        .then((response)=> {
            console.log("브랜치 정보 불러오기 성공");
            console.log("가져온 데이터", response.data.data.projectBranchInfos);
            setBranchData(response.data.data.projectBranchInfos);
            
        })
        .catch((error)=>{
            console.log(error);
        })
    })();
  }, [projectUuid]); 

  return(
    <Box display="block">
      {branchData.map(branch => {
        return(
          <Box display="flex" sx={{ width:"930px", alignItems: "center"}}>
            <Box sx={{width:"250px",fontSize: "20px", fontWeight: "bold", textAlign: "left", textOverflow: 'ellipsis'}}>
              {branch.branchName}
            </Box>
            <Box sx={{fontSize: "16px", fontWeight: "regular", textAlign:"center"}}>
              last update : 2022/08/14 19:00
            </Box>
            <Box sx={{display: "flex", alignItems: "center", ml:"auto"}}>
              <IconButton
                onClick={() => handleModalOpen(branch)}
              >
                <EditIcon/>
              </IconButton>

              <IconButton>
                <DeleteIcon/>
              </IconButton>
            </Box>
          </Box>
        );
        })}
      <BranchEditBox branch={activeModalBranch} onClose={handleModalClose} />
    </Box>
  );
}