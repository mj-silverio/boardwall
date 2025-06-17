## navigation
# for i in navigation footer auth about-version home not-found settings quick-links; 
#     do ( ng g c menu/general/$i ); 
# done

## auth
# for i in login signup; 
#     do ( ng g c auth/$i ); 
# done


## utils
# ng g c utils/snackbar

## core
# for i in user board-wall board category sticky-note; 
#     do ( ng g c components/core/$i ); 
# done

## presentation
# for i in navigation main-menu canvas-editor toolbar settings not-found; 
#     do ( ng g c components/presentation/$i ); 
# done

# ng g c components/presentation/main-menu/board-display

## Services

# ng g s services/user-account
# ng g s services/board-wall
# ng g s services/board
# ng g s services/category
# ng g s services/sticky-note
# ng g s services/backup

## Utils

# ng g c utils/import-export