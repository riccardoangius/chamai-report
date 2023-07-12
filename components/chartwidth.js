import { useMemo } from "react"
import { useWindowSize } from "rooks"

export const useChartWidth = (props) => {
    const { innerWidth } = useWindowSize();

    const width = useMemo(() => {

        if (innerWidth < 1200) {
            // return (innerWidth - 200) + 'px'
            return '100%'
        }
        else {
            return '1000px'
        }

    }, [innerWidth])
    return { width }
}