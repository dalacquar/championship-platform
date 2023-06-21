
import {Box, Heading, Tabs, TabList, Tab, TabPanel, TabPanels, Image, Button, Select, useToast, Flex, Grid} from '@chakra-ui/react';
import { Championship, Rodada, Team } from '@/interfaces';
import { addTeam } from '@/services/championship/add';
import { useRouter } from 'next/router';
import { ConfirmModal } from './confirmModal';
import RodadaComponent from './rodadaComponent';
import UserContext from '@/context/UserContext';
import React, { useContext, useEffect, useState } from 'react';
import ChampionshipPreview from './championshipPreview';
import axios from 'axios';
import { getTeams } from '@/services/team/retrieve';


interface ChampionshipTeam {
  team_id: number;
  championship_id?: number;
}

interface ChampionshipHeaderProps {
  championship?: Championship;
  teams?: Array<Team>;
  championshipTeams?: Array<Team>;
}



let ct: ChampionshipTeam;


const ChampionshipHeader: React.FC<ChampionshipHeaderProps> = ({ championship, teams, championshipTeams}) => {

  const {id} = useContext(UserContext);
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<number>(0);
  const toast = useToast();
  const [teamsChampionship, setTeamsChampionship] = useState(Array<Team>);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chaveamento, setChaveamento] = useState<Array<Rodada>>();
  const [tabIndex, setTabIndex] = useState<Number>(1);




  useEffect(
    () => {
        if(championshipTeams){       
          setTeamsChampionship(championshipTeams);
      }
    },[championship]
  )

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(Number(event.target.value));
  };

  function handleConfirmModal(){
    if(selectedTeam == 0){
      toast(
        {
          title: "Selecione um time",
          status: "error",
          duration: 3000,
          isClosable: true,
        }
      )
      return
    }
    setIsOpenConfirmModal(true);
    
  }

  const handleButtonClick = async () => {
        setIsLoading(true)     
        const championshipTeam: ChampionshipTeam = {
          team_id: selectedTeam,
          championship_id: championship?.id}
        const response = await addTeam(championshipTeam);
        if(response){
          toast(
            {
              title: response.message,
              status: response.status,
              duration: 3000,
              isClosable: true,
            }
          )
          if(response.status=="success"){
            const response2 = await getTeams();
            const teamsChampionships = response2.data?.filter((team: Team) => {
            const filtredChampionships = team.championships.filter((championship_filter: Championship) => championship_filter.id == (championship ? championship.id : 0))
              if(filtredChampionships.length !== 0){
                 return filtredChampionships;
              }
            })  
            if(teamsChampionships){
            setTeamsChampionship(teamsChampionships)
          }
            
          }
          setIsLoading(false)
          setIsOpenConfirmModal(false)
        }
  };

  function gerarChaveamento() {
    const rodada=1;
    if(championshipTeams && championship){
      const compararAleatoriamente = () => Math.random() - 0.5;
      const timesAleatorizados: Team[] = [...championshipTeams].sort(compararAleatoriamente);
      if(timesAleatorizados.length >= championship.min_teams){
        gerar_partidas(timesAleatorizados, rodada)
      }
    }
  }

  function gerar_partidas(teams:any[], num_rodada:Number){
    
    if(!championship){
      return
    } else {
      let chave = 1;
      const array_rodadas: Rodada[] = []
      for (let i = 0; i < teams.length; i += 2) {
        const team: Team[] = teams.slice(i, i + 2);
        if(team[1]){
          const rodada :Rodada = {
            championship_id: championship?.id,
            team_1_id: team[0].id,
            team_2_id: team[1].id,
            rodada: num_rodada,
            chave: chave,
          }
          array_rodadas.push(rodada)
        } else {
          var rodada :Rodada = {
            championship_id: championship?.id,
            team_1_id: team[0].id,
            rodada: num_rodada,
            chave: chave,
          }
          array_rodadas.push(rodada)
        }
        chave++;
      }
      setChaveamento(array_rodadas)
    }
    
  }

  return (
        <Box textColor={'black'}>
          <Image
            width={"100%"}
            maxHeight={'200px'}
            objectFit={'cover'}
            overflow={'hidden'}
            alt={'lol-image'}
            src={
              championship?.game_id == 0 
              ?'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt8979808f7798ecf5/6216ee875fe07272a8a2447a/2021_Key_art.jpg'
              : 'https://iili.io/HrHUeYG.png'
            }
            borderLeft='1px solid white'
            borderBottom='1px solid white'
            borderRight='1px solid white'
             
            />
            <Heading textAlign={'center'} color={'white'} pt={'20px'} h={'10vh'}>
               {championship?.name}
            </Heading>
            <Tabs onChange={(index) => setTabIndex(index)} color={'white'} marginTop={'5'} colorScheme={'whiteAlpha'} size={'md'} textAlign={'center'} align={'center'} borderColor={'white'} >
                <TabList>
                    <Tab>Rules</Tab>
                    <Tab>Prizes</Tab>
                    <Tab>Teams</Tab>
                    <Tab>Contact</Tab>
                    <Tab>Brackets</Tab>
                </TabList>
            <TabPanels>
                <TabPanel>{championship?.rules}</TabPanel>
                <TabPanel>{championship?.prizes}</TabPanel>
                <TabPanel>
                  {championshipTeams?.map((team, index) => (
                    <p key={index}>{team.name}</p>
                  ))}
                </TabPanel>
                <TabPanel>{championship?.contact}</TabPanel>
                <TabPanel>
                  <Box w="100%" h={"10vh"}>
                    {championship?.admin_id == id ? 
                    <Button onClick={gerarChaveamento} float="right" colorScheme='blue'>
                      Gerar chaveamento
                    </Button> 
                    :
                    <></>}
                    <Box float="left">
                      Times no campeonato: {championshipTeams?.length}
                    </Box>
                  </Box>
                  <Box w="100%">
                    <Grid templateColumns={championshipTeams?`repeat(${Math.ceil(championshipTeams.length/2)}, 1fr)`:'repeat(2, 1fr)'} >
                    {chaveamento ? chaveamento.map((rodada) => (
                          <RodadaComponent rodada={rodada}></RodadaComponent>
                        ))
                        :
                        <></>
                      }
                    </Grid>
                  </Box>
                </TabPanel>
            </TabPanels>
            </Tabs>
            { (tabIndex != 4) ?
            (
              (teams) != null ? 
              (teams.length != 0 ? (
                <Box mt="150px" w="100%" flexDirection={"column"} display="flex" alignItems={"center"} justifyContent={"center"} textAlign={"center"}>
                  <Heading color={'white'} h={'4vh'} size={'sm'} textAlign={'center'} bottom={'10'}>Select a team:</Heading>
                  <Select
                    color={'black'}
                    colorScheme={'blackAlpha'}
                    size={'sm'}
                    mb="10px"
                    width={"30vw"}
                    iconSize={'100px'}
                    name="game_id"
                    value={selectedTeam || ''}
                    onChange={handleTeamChange}
                    >
                    <option value='0'>Selecione...</option>            
                    {teams?.map((team) => (
                      <option key={team.id} value = {team.id}>
                        {team.name}
                      </option>
                    ))}
                  </Select>
                  <Button mb="50px" w="10vw" onClick={handleConfirmModal} colorScheme='blue' size={'md'}>Join</Button>
                  <ConfirmModal
                        content="Are you sure you want to join in the championship with this team?"
                        handleConfirm={handleButtonClick}
                        isOpen={isOpenConfirmModal}
                        setIsOpen={setIsOpenConfirmModal}
                  />
                </Box>) 
                : 
                (
                  <Box mb="50px" mt="150px" w="100%" flexDirection={"column"} display="flex" alignItems={"center"} justifyContent={"center"} textAlign={"center"}>
                    <Heading color={'white'} h={'4vh'} size={'sm'} textAlign={'center'}> Looks like you don't have a team yet</Heading>
                    <Button colorScheme={"blue"} onClick={()=>router.push('/profile/teams/new')}>
                        Create Team
                    </Button>
                  </Box>
                )) 
                : 
                (
                <></>
                ) 
              )
              :
              (<></>)
            }
        </Box>
  );
};


export default ChampionshipHeader;