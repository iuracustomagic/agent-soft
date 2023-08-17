import {StyleSheet} from 'react-native'


export const styles = StyleSheet.create({
    authFormBlock: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    authForm: {
        flex: 1,
        maxWidth: 300,
        maxHeight: 300,
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    authTitle: {
        textAlign: 'center',
        color: 'black'
    },
    hsCenterBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        height: '40%'
    },
    hsBtnsBlock: {
        height: '30%',
        width: '70%',
        display: 'flex',
        justifyContent: 'center',
    },
    hsLogo: {
        width: 160,
        height: 120,
        alignSelf: 'center',
        justifyContent: 'flex-end',
        display: 'flex',
    },
    version: {
        position: 'absolute',
        left: 20,
        bottom: 10,
        color: 'black'
    },
    listContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    /* flatList: {
        flex: 7,
    },
    listHeader: {
        flex: 2,
    },
    listFooter: {
        flex: 1
    }, */
    listHeaderTitle: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center'
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputSearch: {
        width: '100%'
    },

})
