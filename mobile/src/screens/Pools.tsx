import { useCallback, useState } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { Button } from "../components/Button";
import { Octicons } from '@expo/vector-icons'
import { Header } from "../components/Header";
import { useNavigation , useFocusEffect} from '@react-navigation/native';
import { api } from "../services/api";
import { Loading } from "../components/Loading";
import { PoolCard, PoolCardPros } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
  const [isLoading, setIsLoading] = useState(false)
  const [pools, setPools] = useState<PoolCardPros[]>([])
  const navigation = useNavigation();
  const toast = useToast();
  async function fetchPools() {
    try {
      setIsLoading(true)
      const result = await api.get('/pools')

      setPools(result.data.pools)

    } catch (error) {
      console.log(error)
      toast.show({
        title: 'nao foi possivel lista bolões ',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)

    }

  }

  useFocusEffect(useCallback(() => { fetchPools() }, []))

  return (
    <VStack flex={1} bgColor="gray.900" >
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigation.navigate('find')}
        />
      </VStack>
      {
        isLoading ? <Loading /> :
          <FlatList
            data={pools}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <PoolCard 
            data={item}
            onPress={() => navigation.navigate('details', { id : item.id})}     
            />}
            ListEmptyComponent={() => <EmptyPoolList />}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ pb: 10 }}
            px={5}
          />
      }
    </VStack>
  )
}