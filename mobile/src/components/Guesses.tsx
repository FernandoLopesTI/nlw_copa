import { FlatList, useToast } from 'native-base';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';



interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')
  const [games, setGames] = useState<GameProps[]>([])
  const toast = useToast();

  async function handleGuessConfigm(gameId:string) {
    try {
      
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim() ){
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
      setIsLoading(true)
      console.log(`/poots/${firstTeamPoints}/games/${secondTeamPoints}/guesses`)
      await api.post(`/poots/${poolId}/games/${gameId}/guesses`,
      {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      }
      )

      toast.show({
        title: 'Palpite realizado com sucesso ',
        placement: 'top',
        bgColor: 'green.500'
      })

      fetchGames()
      
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'nao foi possivel fazer o palpites ',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }


  async function fetchGames() {
    try {
      setIsLoading(true)
      const response = await api.get(`/pools/${poolId}/games`)
      setGames(response.data.games)

    } catch (error) {
      console.log(error)
      toast.show({
        title: 'nao foi possivel carregar os detalhes do bolao ',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }

  }

  useEffect(() => { fetchGames() }, [poolId])

  if(isLoading){
    return <Loading />
  }
  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={ () => handleGuessConfigm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
    />
  );
}
